const Role = require("../../model/roles/role");
const UsersRole = require("../../model/roles/users-role");

const addRole = async (nameRole, idProject) => {
    const newRole = new Role({
        nameRole: nameRole,
        idProject: idProject,
    })
    await newRole.save();
    return newRole;
}

const addUserRole = async (idRole, idUser, idProject) => {;
    const newUserRole = new UsersRole({
        idRole, idUser, idProject
    });
    await newUserRole.save();
}

module.exports = {
    addRole, addUserRole
};