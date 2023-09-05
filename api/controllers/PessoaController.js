const database = require('../models')
const Sequelize = require('sequelize')

class PessoaController {
  static async pegaTodasAsPessoas(req, res) {
    try {
      const todasAsPessoas = await database.Pessoas.findAll() //o findAll é do sequelize
      return res.status(200).json(todasAsPessoas)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaPessoasAtivas(req, res) {
    try {
      const pessoasAtivas = await database.Pessoas.scope('todos').findAll() //o findAll é do sequelize
      return res.status(200).json(pessoasAtivas)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaUmaPessoa(req, res) {
    const { id } = req.params
    try {
      const umaPessoa = await database.Pessoas.findOne({
        where: { id: Number(id) },
      })
      return res.status(200).json(umaPessoa)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async criaPessoa(req, res) {
    const novaPessoa = req.body
    try {
      const novaPessoaCriada = await database.Pessoas.create(novaPessoa)
      return res.status(200).json(novaPessoaCriada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async atualizaPessoa(req, res) {
    const novasInfos = req.body
    const { id } = req.params

    try {
      await database.Pessoas.update(novasInfos, { where: { id: Number(id) } })
      const pessoaAtualizada = await database.Pessoas.findOne({
        where: { id: Number(id) },
      })

      return res.status(200).json(pessoaAtualizada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async apagaPessoa(req, res) {
    const { id } = req.params

    try {
      await database.Pessoas.destroy({ where: { id: Number(id) } })
      return res.status(200).json({ mensagem: `id ${id} deletado` })
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async restauraPessoa(req, res) {
    const { id } = req.params

    try {
      await database.Pessoas.restore({ where: { id: Number(id) } })
      return res
        .status(200)
        .json({ mensagem: `id ${id} restaurado com sucesso` })
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaUmaMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params

    try {
      const umaMatricula = await database.Matriculas.findOne({
        where: { id: Number(matriculaId), estudante_id: Number(estudanteId) },
      })
      return res.status(200).json(umaMatricula)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async criaMatricula(req, res) {
    const { estudanteId } = req.params
    const novaMatricula = { ...req.body, estudante_id: Number(estudanteId) }
    try {
      const novaMatriculaCriada = await database.Matriculas.create(
        novaMatricula
      )
      return res.status(200).json(novaMatriculaCriada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaTodasAsMatriculas(req, res) {
    try {
      const todasAsMatriculas = await database.Matriculas.findAll() //o findAll é do sequelize
      return res.status(200).json(todasAsMatriculas)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async atualizaMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params
    const novasInfos = req.body

    try {
      await database.Matriculas.update(novasInfos, {
        where: { id: Number(matriculaId), estudante_id: estudanteId },
      })
      const matriculaAtualizada = await database.Matriculas.findOne({
        where: { id: Number(matriculaId) },
      })

      return res.status(200).json(matriculaAtualizada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async apagaMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params

    try {
      await database.Matriculas.destroy({
        where: { id: Number(matriculaId), estudante_id: estudanteId },
      })
      return res
        .status(200)
        .json({ mensagem: `Matricula ${matriculaId} deletado com sucesso` })
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaMatricula(req, res) {
    const { estudanteId } = req.params

    try {
      const pessoa = await database.Pessoas.findOne({
        where: { id: Number(estudanteId) },
      })
      const matriculas = await pessoa.getAulasMatriculadas() //nome que foi dado para o scope

      return res.status(200).json(matriculas)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaMatriculaPorTurma(req, res) {
    const { turmaId } = req.params

    try {
      const todasAsMatriculas = await database.Matriculas.findAndCountAll({
        where: {
          turma_id: Number(turmaId),
          status: 'confirmado',
        },
        limit: 20,
        order: [['estudante_id', 'DESC']],
      })

      return res.status(200).json(todasAsMatriculas)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaTurmasLotadas(req, res) {
    const lotacaoTurma = 2

    try {
      const turmasLotadas = await database.Matriculas.findAndCountAll({
        where: {
          status: 'confirmado',
        },
        attributes: ['turma_id'],
        group: ['turma_id'],
        having: Sequelize.literal(`count(turma_id) >= ${lotacaoTurma}`),
      })

      return res.status(200).json(turmasLotadas)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }
}

module.exports = PessoaController
