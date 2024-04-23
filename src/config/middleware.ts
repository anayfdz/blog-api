import express, { Request, Response, NextFunction } from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';

export const applyMiddleware = (app: express.Application): void => {
    // Middleware para parsear el body de las solicitudes
    app.use(json());
    app.use(urlencoded({extended: true}));
    // Middleware para permitir solicitudes de otros dominios
    app.use(cors());

    // Middleware para manejar errores
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send('Something broke!')
    });
};