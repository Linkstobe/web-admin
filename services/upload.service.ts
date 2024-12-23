import { Api } from "@/provider";

export const UploadService = {
  async uploadImage(formData: FormData) {
    const { data } = await Api.post("/upload/image", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },
};
