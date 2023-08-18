import { auth } from "@/firebase/firebaseAuth";
import { db } from "@/firebase/firebaseDB";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { rest } from "msw";

export const handlers = [
  // 회원가입 mocking API
  rest.post("http://localhost:3000/signup", async (req, res, ctx) => {
    const { email, password, keywords, gender, height, weight } = await req.json();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", email), {
        email,
        gender,
        height,
        weight,
        keywords,
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
        alert("이미 존재하는 이메일입니다.");
        return res(ctx.status(200), ctx.json({ success: true }), ctx.json({ message: "이미 존재하는 이메일입니다." }));
      } else {
        alert("사용 가능한 이메일입니다.");
        return res(ctx.status(200), ctx.json({ success: true }), ctx.json({ message: "사용 가능한 이메일입니다." }));
      }
    } catch (error) {
      return res(
        ctx.status(400),
        ctx.json({ success: false }),
        ctx.json({ message: "이메일 중복 확인에 실패하였습니다." }),
      );
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
];
