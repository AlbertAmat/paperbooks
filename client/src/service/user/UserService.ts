import {PATH_PREFIX} from "@/Constants";
import {ISearchResponse} from "@/types/search/ISearchResponse";
import axiosInstance from "@/plugins/axiosInstance";
import ILocation from "@/types/location/ILocation";

class UserService {


    public async uploadImage(file: File) {
        const formData = new FormData();
        formData.append("image", file); // "image" must match upload.single("image")

        await axiosInstance.post(`${PATH_PREFIX}/user/image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                // Add auth header if your `requireAuth` middleware uses tokens
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
    }

    public async removeImage() {
        await axiosInstance.delete(`${PATH_PREFIX}/user/image`)
    }

    public async delete() {
        await axiosInstance.delete(`${PATH_PREFIX}/user`)
    }

    public async changePassword(currentPassword: string, newPassword: string) {
        await axiosInstance.post(`${PATH_PREFIX}/user/password`, {
            currentPassword: currentPassword,
            newPassword : newPassword,
        })
    }

    public async update(name: string, email: string, language: string, region: string) {
        await axiosInstance.put(`${PATH_PREFIX}/user`, {
            name: name,
            email: email,
            language: language,
            region: region
        })
    }

}

export const userService = new UserService();