import Qs from 'qs'
import { apiClient } from "./ApiClient";
import ImageCompressor from './ImageCompressor';

export default class PostUtil {

    static uploadPicture(pic, picurl) {
        return ImageCompressor.compressImage(pic, 1024).then(res => {
        return apiClient.post("/file/uploadPostPic", { file: res }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        })


    }

    static sendPost(content, pics, notice, who_can_see, location, list, setList) {
        let data = { 
            images: pics, 
            content: content, 
            authorName: "author", 
            notice: [], 
            users: who_can_see, 
            location: location, 
            voices: [], 
            videos: [], 
            comments: [] 
        };
        
        apiClient.post("/post/upload", data, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(exception => {
            console.log(exception);
        }).then(response => {
            if (response) {
                setList([data, ...list]);
            }
        });
    }

    static getPostsById(id, list, setList) {
        const requestData = Qs.stringify({
            userID: localStorage.getItem("userId")
        });

        apiClient.post("/post/get_by_user_id", requestData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).catch(exception => {
            console.log(exception);
        }).then(response => {
            if (!response || !response.data || !response.data.posts) {
                console.log("connection error");
                return;
            }
            setList([...list, ...response.data.posts]);
        });
    }

    static getFriendPosts(list, setList) {
        const requestData = Qs.stringify({});

        apiClient.post("/post/get_friends_posts", requestData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).catch(exception => {
            console.log(exception);
        }).then(response => {
            if (!response || !response.data || !response.data.posts) {
                console.log("connection error");
                return;
            }
            setList([...list, ...response.data.posts]);
        });
    }

    static getRecommendPosts() {
        // Implementation needed
    }
}