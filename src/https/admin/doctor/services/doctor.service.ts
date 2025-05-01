export const addDoctor = async (data: any) => {
  try {
    const { roleId } = data;

    return true;
  } catch (error: any) {
    return error;
  }
};
