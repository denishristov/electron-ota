import { RouterStore } from "mobx-react-router";
import UserStore from "./UserStore";

export interface IUserStore {
	userStore: UserStore
	routeStore: RouterStore
}