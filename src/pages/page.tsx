// import FXDailyForecast from "../app/components/client/FXDailyForecast";
// import List from "../app/components/client/List";
// import SalmonForecast from "../app/components/client/SalmonForecast";
// import {
//   useMsal,
//   AuthenticatedTemplate,
//   UnauthenticatedTemplate,
// } from "@azure/msal-react";
// import { authScopes } from "../authConfig";
// import { useEffect, useState } from "react";

// export default function App() {
//   const { instance, accounts } = useMsal();
//   const [accountDetails, setAccountDetails] = useState(null);

//   if (accounts.length > 0) {
//     console.log("accounts", accounts);
//   }

//   function handleLogin() {
//     console.log("accounts", instance);
//     instance
//       .loginPopup(authScopes)
//       .then((response) => {
//         console.log("login successful!", response);

//         instance.setActiveAccount(response.account);
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }

//   function handleLogout() {
//     instance
//       .logoutPopup({ postLogoutRedirectUri: "/" })
//       .then((response) => {})
//       .catch((e) => {
//         console.log(e);
//       });
//   }

//   return (
//     <main>
//       <div>
//         <img
//           src="/imarex-logo.png"
//           alt="Logo"
//           style={{ width: "142px", height: "52px" }}
//         />
//         <hr className="border-cyan-500 border-2" />
//       </div>
//       <div className="flex flex-grow">
//         <div className="mt-2 w-fit border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl">
//           <div className="">
//             <List />
//             <FXDailyForecast />
//           </div>
//         </div>
//         <div className="ml-4 mt-2 h-fit w-fit border-solid border-2 border-slate-200 rounded-xl bg-white shadow-xl">
//           <SalmonForecast />
//         </div>
//       </div>
//       <AuthenticatedTemplate>
//         <h6>You are logged in</h6>

//         <button onClick={() => handleLogout()}>Log Out</button>
//       </AuthenticatedTemplate>

//       <UnauthenticatedTemplate>
//         <h6>Please log in</h6>

//         <button onClick={() => handleLogin()}>Log In</button>
//       </UnauthenticatedTemplate>
//     </main>
//   );
// }
