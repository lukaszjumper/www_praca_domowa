import * as sqlite3 from "sqlite3";

export function check(login: string, password: string, func: (ok:boolean) => void) {
    const db = new sqlite3.Database('data.db');
    db.all('SELECT * FROM users WHERE login = ? AND password = ?;', [login, password], (err, rows) => {
        let exists = false;
        rows.forEach(row => {
            exists = true;
        });
        func(exists);
    });
}

export function changePassword(login: string, newPassword: string, func: () => void) {
    const db = new sqlite3.Database('data.db');
    db.run('REPLACE INTO users VALUES (?, ?);', [login, newPassword], () => {
        func();
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