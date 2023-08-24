import { auth } from "@/firebase/firebaseAuth";
import { db } from "@/firebase/firebaseDB";
import { storage } from "@/firebase/firebaseStorage";
import { v4 as uuidv4 } from "uuid";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { rest } from "msw";
import axios from "axios";

export const handlers = [
  // 회원가입 mocking API
  rest.post("http://localhost:3000/signup", async (req, res, ctx) => {
    const { email, password, keywords, gender, height, weight, nickname } = await req.json();
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // 이메일 인증 메일 보내기.
          sendEmailVerification(userCredential.user);
        })
        .then(() => {
          setDoc(doc(db, "users", email), {
            email,
            gender,
            height,
            weight,
            keywords,
            nickname,
          });
        });
      return res(ctx.status(201), ctx.json({ success: true }), ctx.json({ message: "회원 가입에 성공하였습니다." }));
    } catch (error) {
      return res(ctx.status(400), ctx.json({ success: false }), ctx.json({ message: "회원 가입에 실패하였습니다." }));
    }
  }),
  // 로그인 mocking API
  rest.post("http://localhost:3000/signin", async (req, res, ctx) => {
    const { email, password } = await req.json();
    try {
      await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        localStorage.setItem("user", JSON.stringify(userCredential.user));
        alert("로그인에 성공하였습니다.");
      });
      return res(ctx.status(200), ctx.json({ success: true }), ctx.json({ message: "로그인에 성공하였습니다." }));
    } catch (error) {
      return res(ctx.status(400), ctx.json({ success: false }), ctx.json({ message: "로그인에 실패하였습니다." }));
    }
  }),
  // 로그아웃 mocking API
  rest.get("http://localhost:3000/signout", async (req, res, ctx) => {
    try {
      localStorage.removeItem("user");
      return res(ctx.status(200), ctx.json({ success: true }), ctx.json({ message: "로그아웃에 성공하였습니다." }));
    } catch (error) {
      return res(ctx.status(400), ctx.json({ success: false }), ctx.json({ message: "로그아웃에 실패하였습니다." }));
    }
  }),
  // 사용자 개인 정보 확인 mocking API
  rest.get("http://localhost:3000/userinfo", async (req, res, ctx) => {
    const user = localStorage.getItem("user");
    const { email } = JSON.parse(user as string);
    try {
      getDoc(doc(db, "users", email)).then((doc) => {
        console.log("userinfo", doc.data());
      });
      return res(
        ctx.status(200),
        ctx.json({ success: true }),
        ctx.json({ message: "사용자 정보를 불러오는데 성공하였습니다." }),
      );
    } catch (error) {
      return res(
        ctx.status(400),
        ctx.json({ success: false }),
        ctx.json({ message: "사용자 정보를 불러오는데 실패하였습니다." }),
      );
    }
  }),
  // 이메일 중복 확인 mocking API
  rest.post("http://localhost:3000/emailcheck", async (req, res, ctx) => {
    const { email } = await req.json();
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const emailExists = !querySnapshot.empty;
    try {
      if (emailExists === true) {
        // alert("이미 존재하는 이메일입니다.");
        return res(ctx.status(200), ctx.json({ success: true, message: "이미 존재하는 이메일입니다." }));
      } else {
        // alert("사용 가능한 이메일입니다.");
        return res(ctx.status(200), ctx.json({ success: true, message: "사용 가능한 이메일입니다." }));
      }
    } catch (error) {
      return res(
        ctx.status(400),
        ctx.json({ success: false }),
        ctx.json({ message: "이메일 중복 확인에 실패하였습니다." }),
      );
    }
  }),
  // 닉네임 중복검사
  rest.post("http://localhost:3000/nicknamecheck", async (req, res, ctx) => {
    const { nickname } = await req.json();
    const userRef = collection(db, "users");
    const q = query(userRef, where("nickname", "==", nickname));
    const querySnapshot = await getDocs(q);
    const nicknameExists = !querySnapshot.empty;
    try {
      if (nicknameExists === true) {
        // alert("이미 존재하는 닉네임입니다.");
        return res(ctx.status(200), ctx.json({ success: true, message: "이미 존재하는 닉네임입니다." }));
      } else {
        // alert("사용 가능한 닉네임입니다.");
        return res(ctx.status(200), ctx.json({ success: true, message: "사용 가능한 닉네임입니다." }));
      }
    } catch (error) {
      return res(
        ctx.status(400),
        ctx.json({ success: false }),
        ctx.json({ message: "닉네임 중복 확인에 실패하였습니다." }),
      );
    }
  }),
  // google 로그인 mocking API
  rest.get("http://localhost:3000/googlelogin", async (req, res, ctx) => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const { email } = userCredential.user;
      await setDoc(doc(db, "users", email as string), {
        email,
      });
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      return res(ctx.status(200), ctx.json({ success: true }), ctx.json({ message: "로그인에 성공하였습니다." }));
    } catch (error) {
      return res(ctx.status(400), ctx.json({ success: false }), ctx.json({ message: "로그인에 실패하였습니다." }));
    }
  }),
  // 회원탈퇴 mocking API
  rest.delete("http://localhost:3000/deleteuser", async (req, res, ctx) => {
    const user = localStorage.getItem("user");
    const { email } = JSON.parse(user as string);
    const curUser = auth.currentUser;
    try {
      await deleteUser(curUser!);
      await deleteDoc(doc(db, "users", email));
      localStorage.removeItem("user");
      return res(ctx.status(200), ctx.json({ success: true }), ctx.json({ message: "회원탈퇴에 성공하였습니다." }));
    } catch (error) {
      return res(ctx.status(400), ctx.json({ success: false }), ctx.json({ message: "회원탈퇴에 실패하였습니다." }));
    }
  }),
  // 게시글 작성 mocking API
  rest.post("http://localhost:3000/postEditor", async (req, res, ctx) => {
    const user = localStorage.getItem("user");
    const { email } = JSON.parse(user as string);
    const { content, dynamicKeywords, staticKeywords, seasonKeywords, weatherKeywords, uploadedImageFiles } =
      await req.json();
    try {
      const imagesArr = [];
      for (const file of uploadedImageFiles) {
        const response = await fetch(file);
        const blob = await response.blob();
        const uniqueId = uuidv4();
        const storageRef = ref(storage, `postImages/${uniqueId}`);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        imagesArr.push({ url });
      }
      const docRef = doc(collection(db, "posts", email, "articles"));
      await setDoc(docRef, {
        email,
        content,
        dynamicKeywords,
        staticKeywords,
        seasonKeywords,
        weatherKeywords,
        images: imagesArr,
        createdAt: serverTimestamp(),
      });

      return res(
        ctx.status(200),
        ctx.set("Content-Type", "multipart/form-data"),
        ctx.json({ success: true }),
        ctx.json({ message: "게시글 작성에 성공하였습니다." }),
      );
    } catch (error) {
      return res(ctx.status(400), ctx.json({ success: false }), ctx.json({ message: "게시글 작성에 실패하였습니다." }));
    }
  }),
  //날씨 정보 불러오기 mocking API
  rest.post("http://localhost:3000/weather", async (req, res, ctx) => {
    const { lat, lon } = await req.json();
    try {
      // 현재 위치의 날씨 정보를 불러옵니다.
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`,
      );
      const curTemperature = response.data.current_weather.temperature;
      const weatherCode = response.data.current_weather.weathercode;
      return res(
        ctx.status(200),
        ctx.json({ success: true, message: "날씨 정보를 불러오는데 성공하였습니다.", curTemperature, weatherCode }),
      );
    } catch (error) {
      // 현재 위치의 날씨 정보를 불러오지 못했을 경우, 서울의 날씨 정보를 불러옵니다.
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=37.566&longitude=126.9784&current_weather=true&timezone=auto`,
      );
      const curTemperature = response.data.current_weather.temperature;
      const weatherCode = response.data.current_weather.weathercode;
      return res(
        ctx.status(400),
        ctx.json({ success: false, message: "날씨 정보를 불러오는데 실패하였습니다.", curTemperature, weatherCode }),
      );
    }
  }),
];

{
  /* 
{
  "latitude": 35.1,
  "longitude": 129.0,
  "generationtime_ms": 0.8410215377807617,
  "utc_offset_seconds": 32400,
  "timezone": "Asia/Seoul",
  "timezone_abbreviation": "KST",
  "elevation": 16.0,
  "current_weather": {
    "temperature": 29.7,
    "windspeed": 11.4,
    "winddirection": 191,
    "weathercode": 3,
    "is_day": 1,
    "time": "2023-08-23T15:00"
  }
}
*/
}
