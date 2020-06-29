import * as bcrypt from "bcrypt";
import {DatabaseHandler} from "./DatabaseHandler";

const dbHandler = new DatabaseHandler();

export function check(login: string, password: string, func: (ok:boolean) => void) {
    dbHandler.selectUser(login, (row) => {
        bcrypt.compare(password, row.password, (err, result) => {
            func(result);
        });
    });
}

export function changePassword(login: string, newPassword: string, func: () => void) {
    hashPassword(newPassword, (hash) => {
        dbHandler.replacePass(login, hash, func);
    });
}

export function ifAuth(session: Express.Session, func: (ok: boolean) => void)  {
    if (session.user === undefined) {
        func(false);
    }
    else {
        check(session.user.id, session.user.password, (ok) => {
            if (ok) {
                func(true);
            }
            else {
                func(false);
            }
        });
    }
}

export function hashPassword(password: string, func: (hash: string) => void) {
    bcrypt.hash(password, 10, (err, hash) => {
        func(hash);
    });
}