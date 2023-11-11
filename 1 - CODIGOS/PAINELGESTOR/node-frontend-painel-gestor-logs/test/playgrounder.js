#!/usr/bin/env node

const http = require('node:http');

let url = '';

http
  .createServer((req, res) => {
    if (req.method === "GET" && req.url === "/update") {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ url }));
    }

    if (req.method === "POST") {
      console.log(`Post: ${new Date()}`);

      const buffer = /** @type {Uint8Array[]} */([]);
      req.on('data', (chunk) => {
        buffer.push(chunk);
      }).on('end', () => {
        url = Buffer.concat(buffer).toString();
      });

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end();
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(makeHtml());
  })
  .listen(51337, () => {
    console.log(`Server running at http://localhost:${51337}/`);
    console.log('\nCopy the snippet below and call it inside one of your tests.\n');

    console.log(`
    export function toPlayground() {
      // eslint-disable-next-line testing-library/no-debugging-utils
      const link = screen.logTestingPlaygroundURL();

      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:51337', false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(link);
      } catch (err) {
        if (!(err instanceof DOMException)) {
          throw err;
        }

        if (err.message.includes('connect ECONNREFUSED')) {
          throw new Error('Playground server is not running. Maybe you forgot to remove the call toPlayground()?');
        } else if (/cross origin .* forbidden/i.test(err.message)) {
          /**
           * jest network error forbidden
           * it completes the connection, but an error is thrown
           */
        } else {
          throw err;
        }
      }

      return link;
    }
    `);
  });

function makeHtml() {
  return  /* html */`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>React Playground With AutoReload</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            overflow: hidden;
          }

          .frame {
            width: 100vw;
            height: 100vh;
          }
        </style>
        <script>
          setInterval(() => {
            fetch('http://localhost:51337/update')
              .then(res => res.json())
              .then(data => {
                const current = document.querySelector('.frame')?.src || '';
                console.log({current, url: data.url})
                if (current !== data.url) {
                  window.navigation.reload()
                }
              });
          }, 5000)
        </script>
      </head>
      <body>
        ${makeInnerBody()}
      </body>
    </html>
    `;
}

function makeInnerBody() {
  return (url === '')
    ? /* html */`
      <div>
        <h1>React Playground With AutoReload</h1>
        <p>
          Copy the snippet below and call it inside one of your tests.
        </p>
      </div>
      <br>
      <pre>
        <code>
          export function toPlayground() {
            // eslint-disable-next-line testing-library/no-debugging-utils
            const link = screen.logTestingPlaygroundURL();

            try {
              const xhr = new XMLHttpRequest();
              xhr.open('POST', 'http://localhost:51337', false);
              xhr.setRequestHeader('Content-Type', 'application/json');
              xhr.send(link);
            } catch (err) {
              if (!(err instanceof DOMException)) {
                throw err;
              }

              if (err.message.includes('connect ECONNREFUSED')) {
                throw new Error('Playground server is not running. Maybe you forgot to remove the call toPlayground()?');
              } else if (/cross origin .* forbidden/i.test(err.message)) {
                /**
                 * jest network error forbidden
                 * it completes the connection, but an error is thrown
                 */
              } else {
                throw err;
              }
            }

            return link;
          }
        </code>
      </pre>
    `
    : /* html */ `
      <iframe class="frame" src="${url}"></iframe>
    `;
}
