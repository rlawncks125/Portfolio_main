import axios from "axios";

export const deleteFile = async (fileName: string) => {
  const imageURL = fileName.split("/").pop()?.split(".")[0];

  let isDeleted = false;

  const deleteResult = await axios
    .delete(`/api/file/${imageURL}`)
    .then((res: any) => res.data.deleted);

  if (Object.values(deleteResult).length > 0) {
    isDeleted = true;
  }
  return isDeleted;
};

export const ImageGetURLByFormData = async (form: FormData) => {
  return await axios
    .post("/api/file", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data.url as string);
};
