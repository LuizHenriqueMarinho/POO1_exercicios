import { knex } from "knex"

export abstract class BaseDatabase { //não pode ser instanciado
    public static connection = knex({ //não permite que o dado seja acessado fora da instancia
        client: "sqlite3",
        connection: {
            filename: "./src/database/poo1-exercicios.db",        
        },
        useNullAsDefault: true,
        pool: { 
            min: 0,
            max: 1,
            afterCreate: (conn: any, cb: any) => {
                conn.run("PRAGMA foreign_keys = ON", cb)
            }
        }
    })
}
