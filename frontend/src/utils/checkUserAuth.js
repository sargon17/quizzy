export default async function checkUserAuth(cookies) {
  if (!cookies.user || !cookies.accessToken) return false;
  console.log("checkUserAuth");
  console.log("accessToken: " + cookies.accessToken);
  const headers = new Headers();
  headers.append("Authorization", "JWT " + cookies.accessToken);

  const requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  fetch("http://localhost:5000/user/isAuth", requestOptions).then(
    (response) => {
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    }
  );
}
