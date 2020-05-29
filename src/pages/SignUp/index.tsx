import React, { useCallback, useRef } from 'react'
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import getValidationErrors from '../../util/getValidationsErrors'

import logoImg from '../../assets/logo.svg'

import Button from '../../components/Button'
import Input from '../../components/Input'

import { Container, Content, Background } from './styles'

const SingUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)

  const handleSubmit = useCallback(async (data: object) => {
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
    } catch (err) {
      console.log(err)
      const errrors = getValidationErrors(err)
      formRef.current?.setErrors(errrors)
    }
  }, [])

  return (
    <Container>
      <Background />

      <Content>
        <img src={logoImg} alt="GoBarber" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu Cadastro</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            icon={FiLock}
            placeholder="Senha"
            type="password"
          />

          <Button type="submit">Cadastrar</Button>
        </Form>

        <a href="login">
          <FiArrowLeft />
          Voltar para Logon
        </a>
      </Content>
    </Container>
  )
}

export default SingUp
