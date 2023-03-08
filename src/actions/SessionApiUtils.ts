import axios from "axios";
import { Session } from "../types/Session";

export function login(
  domain: string,
  email: string,
  password: string
): Promise<Session | void> {
  return axios
    .post<{ session: Session }>(`${domain}/api/auth/session`, {
      email,
      password,
    })
    .then(
      (response) => {
        return response.data.session;
      },
      (err) => {
        console.log(err);
      }
    );
}
