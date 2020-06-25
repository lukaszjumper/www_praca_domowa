import * as sqlite3 from "sqlite3";
import * as bcrypt from "bcrypt";

export function check(login: string, password: string, func: (ok:boolean) => void) {
    const db = new sqlite3.Database('data.db');
    db.all('SELECT * FROM users WHERE login = ?;', [login], (err, rows) => {
        rows.forEach((row) => {
            bcrypt.compare(password, row.password, (err, result) => {
                func(result);
            });
        });
    });
}

export function changePassword(login: string, newPassword: string, func: () => void) {
    const db = new sqlite3.Database('data.db');
    hashPassword(newPassword, (hash) => {
        db.run('REPLACE INTO users VALUES (?, ?);', [login, hash], () => {
            func();
        });
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