import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UserProfile(): JSX.Element {
  const router = useRouter();
  const { userId } = router.query;

  // useEffect(() => {
  //   if (userId) {
  //     router.push(`/userinfo/${userId}`);
  //   }
  // },[userId])

  // return (

  // )
}
