/**
 * Funções para transformar snake_case em camelCase e vice-versa:
 */

function example({ snakeCase } ){
    return model.create({
        snake_case: snakeCase,
    })
}

function example2(){
    const result = model.findall();
    return {
        snakeCase: result.snake_case
    }
}