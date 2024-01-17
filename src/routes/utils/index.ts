import { Permission } from "../../models/permissions";

export const checkPermissionAllSet = async (permissions: any) => {
  try {
    const perm = await Permission.find(
      { name: { $in: permissions } },
      {_id:true, name: true }
    );
    if (perm.length === 0) {
      return {
        status: false,
        permissions: `Unable to find the permission ${permissions.join(
          ", "
        )}`,
      };
    }
    if (Object.entries(perm).length > 0) {
      const names = perm.map((item) => item.name);
      const ifAllPermissionsExists = checkPermissionsExists(permissions, names);
      if (ifAllPermissionsExists.length !== 0) {
        return {
          status: false,
          permissions: `Could not create user. Unable to find the permission ${ifAllPermissionsExists.join(
            ", "
          )}`,
        };
      } else {
      }
    }
    const ids = perm.map((item) => item._id);
    return { status: true, permissions: ids };
  } catch (error:any) {
    throw new Error(error);
  }
};

export const checkPermissionsExists = (
  userPermission: any,
  serverPermission: any
) => {
  let different = [];
  userPermission.sort();
  serverPermission.sort();
  different = userPermission.filter(function (item: any) {
    return serverPermission.indexOf(item) == -1;
  });
  return different;
};
