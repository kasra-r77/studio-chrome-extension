import React, { useReducer } from "react";
import { Flex } from "@instructure/ui-flex";
import { InstUISettingsProvider } from "@instructure/emotion";
import { canvasHighContrast } from "@instructure/ui-themes";
import { Button } from "@instructure/ui-buttons";
import { TextInput } from "@instructure/ui-text-input";
import { login } from "../../actions/SessionApiUtils";

import axios from "axios";

type State = {
  email: string;
  password: string;
  domain: string;
};

type Action = {
  type: string;
  payload: string;
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "email": {
      return {
        email: action.payload,
        password: state.password,
        domain: state.domain,
      };
    }
    case "password": {
      return {
        email: state.email,
        password: action.payload,
        domain: state.domain,
      };
    }
    case "domain": {
      return {
        email: state.email,
        password: state.password,
        domain: action.payload,
      };
    }
  }
}

type LoginProps = {
  setIsAuthorized: (isAuthorized: boolean) => void;
};

const Login = ({ setIsAuthorized }: LoginProps): React.ReactElement => {
  const [state, dispatch] = useReducer(reducer, {
    email: "",
    password: "",
    domain: "",
  });

  const handleChange = ({ target }) => {
    dispatch({
      type: target.name,
      payload: target.value,
    });
  };

  const handleAuthorization = async () => {
    const session = await login(state.domain, state.email, state.password);
    if (session) {
      chrome.storage.local
        .set({
          authToken: session.token,
          studioDomain: state.domain,
          userID: session.user.id,
          userDisplayName: session.user.display_name,
          userAvatar: session.user.avatar_url,
        })
        .then(() => {
          const { user, token } = session;
          if (token) {
            setIsAuthorized(true);
            axios.defaults.headers.common = {
              Authorization: `Bearer user_id="${user.id}",token="${token}"`,
            };
            axios.defaults.baseURL = state.domain;
          }
        });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    handleAuthorization();
  };

  return (
    <InstUISettingsProvider theme={canvasHighContrast}>
      <form className="LoginForm__form" onSubmit={handleSubmit}>
        <Flex direction="column" padding="medium" width="100%">
          <Flex.Item align="center" margin="0 0 small 0">
            <img src="studio-logo.png" alt="Studio logo" height="150px" />
          </Flex.Item>
          <Flex direction="column">
            <Flex.Item
              margin="0 0 x-small 0"
              padding="small"
              overflowY="hidden"
            >
              <TextInput
                name="domain"
                renderLabel="Studio domain"
                type="text"
                placeholder="http://yourdomain.com"
                value={state.domain}
                onChange={handleChange}
              />
            </Flex.Item>
            <Flex.Item
              margin="0 0 x-small 0"
              padding="small"
              overflowY="hidden"
            >
              <TextInput
                name="email"
                renderLabel="Email"
                type="email"
                placeholder="name@school.edu"
                value={state.email}
                onChange={handleChange}
              />
            </Flex.Item>

            <Flex.Item
              margin="0 0 x-small 0"
              padding="small"
              overflowY="hidden"
            >
              <TextInput
                name="password"
                renderLabel="Password"
                type="password"
                value={state.password}
                onChange={handleChange}
              />
            </Flex.Item>
          </Flex>
          <Flex.Item
            as="div"
            width="50%"
            margin="small 0 0 0"
            overflowY="hidden"
            align="center"
            padding="xx-small"
          >
            <Button
              color="primary"
              size="large"
              display="block"
              textAlign="center"
              type="submit"
              data-test="submitButton"
            >
              Sign In
            </Button>
          </Flex.Item>
        </Flex>
      </form>
    </InstUISettingsProvider>
  );
};

export default Login;
