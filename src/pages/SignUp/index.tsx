import React, { useCallback, useRef } from 'react'
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'

import api from '../../services/api'
import { useToast } from '../../hooks/toast'
import getValidationErrors from '../../util/getValidationsErrors'

import logoImg from '../../assets/logo.svg'

import Button from '../../components/Button'
import Input from '../../components/Input'

import { Container, Content, AnimationContent, Background } from './styles'

interface SingUpFormData {
  name: string
  email: string
  password: string
}

const SingUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const history = useHistory()

  const handleSubmit = useCallback(
    async (data: SingUpFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo seis dígitos'),
        })

        await schema.validate(data, { abortEarly: false })

        await api.post('/users', data)

        history.push('/')

        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Você já pode fazer seu login',
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description:
            'Ocorreu um erro ao fazer cadastro, verifique seus dados e tente novamente.',
        })
      }
    },
    [addToast, history],
  )

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContent>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu Cadastro</h1>

            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input
              name="email"
              icon={FiMail}
              placeholder="E-mail"
              type="email"
            />
            <Input
              name="password"
              icon={FiLock}
              placeholder="Senha"
              type="password"
            />

            <Button type="submit" dataTestId="btn-cadastrar">
              Cadastrar
            </Button>
          </Form>

          <Link to="/" data-cy="link-to-home">
            <FiArrowLeft />
            Voltar para Login
          </Link>
        </AnimationContent>
      </Content>
    </Container>
  )
}

export default SingUp
