import React from 'react'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'

import logoImg from '../../assets/logo.svg'

import Button from '../../components/Button'
import Input from '../../components/Input'

import { Container, Content, Background } from './styles'

const SingIn: React.FC = () => (
  <>
    <Container>
      <Content>
        <img src={logoImg} alt="GoBarber" />

        <form>
          <h1>Faça seu Logon</h1>

          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            icon={FiLock}
            placeholder="Senha"
            type="password"
          />

          <Button type="submit">Entrar</Button>

          <a href="forgot">Esqueci minha senha</a>
        </form>

        <a href="login">
          <FiLogIn />
          Criar Conta
        </a>
      </Content>
      <Background />
    </Container>
  </>
)

export default SingIn
