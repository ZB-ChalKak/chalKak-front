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
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { rest } from "msw";
import axios from "axios";

interface postObject {
  email: string;
  content: string;
  dynamicKeywords: string[];
  staticKeywords: string[];
  seasonKeywords: string;
  weatherKeywords: string;
  images: object[];
  createdAt: object;
}

export const handlers = [
  // 회원가입 mocking API
  rest.post("http://localhost:3000/signup", async (req, res, ctx) => {
    const { email, password, keywords, gender, height, weight, nickname } = await req.json();
    const postCount = 0;
    const followers: string[] = [];
    const following: string[] = [];

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
            postCount,
            followers,
            following,
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
    const { content, dynamicKeywords, staticKeywords, seasonKeywords, weatherKeywords, uploadedImageUrls } =
      await req.json();
    try {
      const imagesArr = [];
      for (const file of uploadedImageUrls) {
        const response = await fetch(file);
        const blob = await response.blob();
        const uniqueId = uuidv4();
        const storageRef = ref(storage, `postImages/${uniqueId}`);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        imagesArr.push({ url });
      }
      await addDoc(collection(db, "posts"), {
        email,
        content,
        dynamicKeywords,
        staticKeywords,
        seasonKeywords,
        weatherKeywords,
        images: imagesArr,
        createdAt: serverTimestamp(),
      });
      // user의 postCount를 1 증가시킵니다.
      const userRef = doc(db, "users", email);
      const userDoc = await getDoc(userRef);
      await setDoc(userRef, {
        postCount: userDoc.data()?.postCount + 1,
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

      // 위도경도가 있는 경우
      if (lat && lon) {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`,
        );
        const curTemperature = response.data.current_weather.temperature;
        const weatherCode = response.data.current_weather.weathercode;
        return res(
          ctx.status(200),
          ctx.json({ success: true, message: "날씨 정보를 불러오는데 성공하였습니다.", curTemperature, weatherCode }),
        );
      }
      // 위도 경도가 없는 경우 서울의 날씨 정보를 불러옵니다.
      else {
        // 현재 위치의 날씨 정보를 불러오지 못했을 경우, 서울의 날씨 정보를 불러옵니다.
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=37.566&longitude=126.9784&current_weather=true&timezone=auto`,
        );
        const curTemperature = response.data.current_weather.temperature;
        const weatherCode = response.data.current_weather.weathercode;
        return res(
          ctx.status(200),
          ctx.json({
            success: true,
            message: "서울의 날씨 정보를 불러오는데 성공하였습니다.",
            curTemperature,
            weatherCode,
          }),
        );
      }
    } catch (error) {
      return res(ctx.status(400), ctx.json({ success: false, message: "날씨 정보를 불러오는데 실패하였습니다." }));
    }
  }),
  // 모든 게시글 불러오기 mocking API (키워드가 전체인 경우)
  rest.get(`http://localhost:3000/posts`, async (req, res, ctx) => {
    try {
      const posts: postObject[] = [];
      const q = query(collection(db, "posts"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        posts.push(doc.data() as postObject);
      });
      return res(ctx.status(200), ctx.json({ success: true, message: "게시글을 불러오는데 성공하였습니다.", posts }));
    } catch (error) {
      return res(ctx.status(400), ctx.json({ success: false, message: "게시글을 불러오는데 실패하였습니다." }));
    }
  }),
  // 게시글 불러오기 mocking API (한명의 유저가 작성한 게시글)
  // axios.get(`/posts?email=${email}`)
  rest.get(`http://localhost:3000/userPosts`, async (req, res, ctx) => {
    const email = req.params.email;
    try {
      const userPosts: object[] = [];
      const q = query(collection(db, "posts"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        userPosts.push(doc.data());
      });
      return res(
        ctx.status(200),
        ctx.json({ success: true, message: "게시글을 불러오는데 성공하였습니다.", userPosts }),
      );
    } catch (error) {
      return res(ctx.status(400), ctx.json({ success: false, message: "게시글을 불러오는데 실패하였습니다." }));
    }
  }),
  // 날씨 추천 게시글 불러오기 mocking API (모든 유저가 작성한 게시글 중에서 seasonKeywords와 weatherKeywords 일치하는 게시글)
  // axios.get(`/posts?seasonKeywords=${seasonKeywords}&weatherKeywords=${weatherKeywords}`)
  // Url은 위와 같이 작성해주시면 될 것 같습니다.
  // ft/main 브랜치를 기준으로 설명드리면,
  // 현재 날씨 정보는 Weather.tsx에서 불러오고 있기 떄문에,
  // ${}안에 들어가는 날씨 키워드와 계절 키워드는 Weather.tsx에서 불러온 날씨 정보를 기준으로 작성하시면 될 것 같습니다.
  // 다만, 날씨 추천 게시글 불러오기 api가 main 페이지에서 호출되어야 하므로,
  // 1. Weather.tsx에서 날씨 정보 호출
  // 2. 날씨 정보를 토대로, 날씨 키워드와 계절 키워드를 설정하고,
  // 3. 이때, 날씨 키워드와 계절 키워드는 main페이지에서 사용되어야 하므로, Recoil을 사용하여 전역 상태로 만들어 주시고,
  // 4. Main 페이지에서 위의 axios 요청에 필요한 키워드를 전역 상태로 만들어둔 키워드를 사용하여 요청하시면 될 것 같습니다.
  rest.get(`http://localhost:3000/posts`, async (req, res, ctx) => {
    const seasonKeywords = req.url.searchParams.get("seasonKeywords");
    const weatherKeywords = req.url.searchParams.get("weatherKeywords");
    try {
      const posts: object[] = [];
      const seasonq = query(
        collection(db, "posts"),
        where("seasonKeywords", "==", [seasonKeywords]),
        where("weatherKeywords", "==", [weatherKeywords]),
      );
      const seasonQuerySnapshot = await getDocs(seasonq);
      seasonQuerySnapshot.forEach((doc) => {
        const data = doc.data();
        posts.push(data);
      });
      return res(ctx.status(200), ctx.json({ success: true, message: "게시글을 불러오는데 성공하였습니다.", posts }));
    } catch (error) {
      return res(ctx.status(400), ctx.json({ success: false, message: "게시글을 불러오는데 실패하였습니다람쥐." }));
    }
  }),
  // 게시글 불러오기 mocking API (키워드에 따른 게시글 조회)
  rest.get(`http://localhost:3000/posts/`, async (req, res, ctx) => {
    // url에 담긴 키워드를 가져옵니다.
    const staticKeywords = req.url.searchParams.get("staticKeywords");
    const seasonKeywords = req.url.searchParams.get("seasonKeywords");
    const weatherKeywords = req.url.searchParams.get("weatherKeywords");
    try {
      // dynamicKeywords, staticKeywords, seasonKeywords, weatherKeywords가 여러개일 경우, 각각의 키워드를 배열로 만듭니다.
      // dynamicKeywords가 존재할 경우, dynamicKeywords에 해당하는 게시글을 불러옵니다.
      if (staticKeywords) {
        // staticKeywords가 존재할 경우, staticKeywords에 해당하는 게시글을 불러옵니다.
        const posts: postObject[] = [];

        for (const keywords of staticKeywords) {
          const q = query(collection(db, "posts"), where("staticKeywords", "array-contains", keywords));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            posts.push(doc.data() as postObject);
          });
        }
        // posts에 담긴 게시글 중에서 seasonKeywords와 weatherKeywords가 일치하는 게시글만 불러옵니다.
        if (seasonKeywords && weatherKeywords) {
          posts.filter((post) => {
            return post.seasonKeywords === seasonKeywords && post.weatherKeywords === weatherKeywords;
          });
        }
        return res(ctx.status(200), ctx.json({ success: true, message: "게시글을 불러오는데 성공하였습니다.", posts }));
      }
    } catch (error) {
      return res(ctx.status(400), ctx.json({ success: false, message: "게시글을 불러오는데 실패하였습니다." }));
    }
  }),
  // 게시글 불러오기 mocking API (팔로잉한 유저가 작성한 게시글)
  rest.get(`http://localhost:3000/followingPosts`, async (req, res, ctx) => {
    const followingUsers = req.params.followingUsers;
    try {
      const followingPosts: postObject[] = [];
      for (const email of followingUsers) {
        const q = query(collection(db, "posts"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          followingPosts.push(doc.data() as postObject);
        });
      }
      return res(
        ctx.status(200),
        ctx.json({ success: true, message: "게시글을 불러오는데 성공하였습니다.", followingPosts }),
      );
    } catch (error) {
      return res(ctx.status(400), ctx.json({ success: false, message: "게시글을 불러오는데 실패하였습니다." }));
    }
  }),
];
