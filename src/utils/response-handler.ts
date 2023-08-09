export const handleError = (status: number): boolean => {
  if (status >= 400 && status <= 500) {
    return true;
  }

  return false;
};
