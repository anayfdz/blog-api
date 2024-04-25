import express from 'express';
import { RoleController } from '../controllers/roleController';

const roleRoutes = express.Router();

roleRoutes.post('/role',RoleController.createRole);
roleRoutes.get('/roles', RoleController.getAllRoles);
roleRoutes.get('/role/:id', RoleController.getRoleById);
roleRoutes.put('/role/:id', RoleController.updateRole);
roleRoutes.delete('/role/:id', RoleController.deleteRole);

export { roleRoutes }