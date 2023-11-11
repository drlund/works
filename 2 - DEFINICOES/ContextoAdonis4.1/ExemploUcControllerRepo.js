/**
 * Exemplos de código para cada uma das definições em uma aplicação Adonis JS 4.1:
 * 
 * Esses exemplos ilustram como os conceitos de repository, use case e controller podem ser implementados em uma aplicação 
 * Adonis JS 4.1, seguindo uma abordagem de "Clean Architecture". Lembre-se de adaptar o código conforme as necessidades 
 * específicas da sua aplicação.
 */

/**
 * 1. Exemplo de Repository: 
 * 
 * Nesse exemplo, o repository `UserRepository` encapsula as operações de busca, criação, atualização e exclusão 
 * de usuários no banco de dados. Ele usa o modelo `User` fornecido pelo Adonis JS para realizar as operações de 
 * persistência.
 * 
 * Suponha que você tenha uma entidade chamada `User` e deseje criar um repository para realizar operações 
 * de persistência no banco de dados para essa entidade. Aqui está um exemplo de como o código do repository 
 * pode ser estruturado:
 */

// app/Repositories/UserRepository.js

const User = use('App/Models/User');

class UserRepository {
  async findById(id) {
    return await User.find(id);
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(user, userData) {
    user.merge(userData);
    await user.save();
    return user;
  }

  async delete(user) {
    await user.delete();
  }
}

module.exports = UserRepository;


/**2. Exemplo de Use Case: 
 * 
 * Nesse exemplo, o use case `CreateUserUseCase` encapsula a lógica de negócio para criar um novo usuário na 
 * aplicação. Ele depende do repository `UserRepository` para realizar a operação de criação no banco de dados.
 * 
 * Vamos supor que você tenha um use case para criar um novo usuário na aplicação. Aqui está um exemplo de como 
 * o código do use case pode ser implementado:
 */

// app/UseCases/CreateUserUseCase.js

const UserRepository = use('App/Repositories/UserRepository');

class CreateUserUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(userData) {
    // Lógica de negócio para criar um novo usuário
    // Exemplo: validar dados, gerar hash de senha, etc.

    const user = await this.userRepository.create(userData);

    // Mais lógica de negócio, se necessário

    return user;
  }
}

module.exports = CreateUserUseCase;

/**
 * 3. Exemplo de Controller: 
 * 
 * Nesse exemplo, o controller `UserController` possui um método `store` que é responsável por lidar com a rota de criação 
 * de usuários. Ele recebe os dados do usuário da requisição, valida-os e chama o use case `CreateUserUseCase` para criar 
 * o usuário. O controller também é responsável por enviar a resposta adequada ao cliente, seja em caso de sucesso ou falha.
 * 
 * Vamos supor que você tenha um controller responsável por lidar com as rotas relacionadas aos usuários na 
 * sua aplicação. Aqui está um exemplo de como o código do controller pode ser estruturado:
 */


// app/Controllers/Http/UserController.js

const { validate } = use('Validator');
const CreateUserUseCase = use('App/UseCases/CreateUserUseCase');

class UserController {
  async store({ request, response }) {
    const userData = request.only(['name', 'email', 'password']);

    // Validação dos dados do usuário
    const validation = await validate(userData, {
      name: 'required',
      email: 'required|email|unique:users',
      password: 'required|min:6',
    });

    if (validation.fails()) {
      return response.status(400).json(validation.messages());
    }

    const createUserUseCase = new CreateUserUseCase();
    const user = await createUserUseCase.execute(userData);

    return response.status(201).json(user);
  }
}

module.exports = UserController;
