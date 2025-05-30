import Qs from 'qs'
import axios from "axios"
import { add, clear, batchAdd } from "../../components/redux/searchResult"
import { Language } from '@mui/icons-material';
import {DOWNLOAD_BASE_URL, API_BASE_URL, FLASK_API_BASE_URL} from "./URL";

export default class SearchUtil {


  static stateSetter(list, dispatch) {
    dispatch(clear())
    dispatch(batchAdd(list))
  }

  static mockSearch(dispatch) {
    let list = [{ name: "james", pics: "siehru", intro: "sus", type: "contact" }, { name: "time", pics: "zdxf", intro: "sfs", type: "movie" }]
    this.stateSetter(list, dispatch)
  }

  static searchChatContactById(keyword, setList) {
    return axios({
      url: FLASK_API_BASE_URL + "/search/contactById",
      method: 'post',
      data: { userId: keyword },
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理
        console.log(Qs.stringify(data))
        return Qs.stringify(data)
      }], headers: {
        token: localStorage.getItem("token"),
      }
    }).catch(error => {
      if ("Network Error" === error.message) {
        //props.setBarState({...props.barState, message:"please login first1233333" + error, open:true})
        // setNetworkErr(true)
        console.log(error)
      }
    }).then(function (response) {
      if (response === undefined) {
        console.log("did not get message")
        return
      }
      if (response.data === undefined) {
        console.log("did not get meesage")
        return
      }
      let responseData = response.data
      if (responseData.code === -1) {
        //props.setBarState({...props.barState, message:responseData.message, open:true})
      }
      else if (responseData.code === 0) {
        //setSearchResults(responseData.result)
        // if (pagingStatus === null) {
        //     setPagingStatus(responseData.pagingStatus)
        // }
        let result = JSON.parse(responseData.message)
        console.log(result)
        let adder = []
        result.forEach(element => {
          adder.push({ name: element.userName, intro: element.introduction, pic: element.avatar, type: "contact", userId: element.userId, })
        });
        setList(adder)
      }
      else {
        //props.setBarState({...props.barState, message:responseData.message, open:true})
      }
      //setNetworkErr(false)
    })
  }

  static searchContactByName(keyword, setSearchResults, pagingStatus, setPagingStatus) {
    return axios({
      url: API_BASE_URL + "/search/contacts",
      method: 'post',
      data: { userId: keyword },
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理
        return Qs.stringify(data)
      }], headers: {
        token: localStorage.getItem("token"),
      }
    }).catch(error => {
      if ("Network Error" === error.message) {
        //props.setBarState({...props.barState, message:"please login first1233333" + error, open:true})
        // setNetworkErr(true)
        console.log("error")
      }
    }).then(function (response) {
      if (response === undefined) {
        console.log("errror")
      }
      console.log(response)
      let responseData = response.data
      if (responseData.code === -1) {
        //props.setBarState({...props.barState, message:responseData.message, open:true})
      }
      else if (responseData.code === 0) {
        if (responseData.result !== null) {
          setSearchResults(responseData.result)
        }
      }
      else {
        //props.setBarState({...props.barState, message:responseData.message, open:true})
      }
      //setNetworkErr(false)
    })
  }

  static searchVideos(keyword, setList) {
    setList([])
    
    let userInfo = localStorage.getItem("userInfo")
    let language = null
    if (userInfo === null) { 
      language = "en-US"
    }
    language = JSON.parse(userInfo).language
    console.log(language)
    return axios({
      url: FLASK_API_BASE_URL + "/movie/search",
      method: 'get',
      params: { "keyword": keyword, page_number:1, "Accept-Language": language},
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理
        return Qs.stringify(data)
      }], headers: {
        token: localStorage.getItem("token"),
      }
    }).then(function (response) {
      console.log(response)
      if (response === undefined) {
        console.log("errror")
      }
      setList(response.data)
      
        // let result = JSON.parse(response.data)
        // let movies = []
        // result.forEach((element, index)=> {
        //   movies.append({ type: "movie", "image_address": element.img_address, "translated_name": element.translated_name, "original_name": element.original_name, "release_date": element.release_date, "introduction": element.introduction, "detail_address": element.detail_address })
        // })

        // SearchUtil.stateSetter(movies, dispatch)
        // //props.setBarState({...props.barState, message:responseData.message, open:true})
  })
  }

  static searchPosts(keyword, setList) {
            return new Promise((resolve, reject) => {
    setList([{type:"posttesttest"}])

  });
  }

  static getSuggestions(keyword, setList) {
        return new Promise((resolve, reject) => {
    setList([{ type: "testtest" }])

  });
  }

  static searchMusics(keyword, setList) {
    return new Promise((resolve, reject) => {
        setList([{ type: "musictesttest" }]) 

  });
  }
  
  static searchLocalResult(keyword, setList) {
    return new Promise((resolve, reject) => {
      setList([{ type: "chatrecord testtest" }])

  });
  } 
}