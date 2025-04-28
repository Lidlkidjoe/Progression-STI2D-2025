import { auth } from "./firebase.js";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";

const githubProvider = new GithubAuthProvider();

/**
 * Fonction pour gérer l'authentification GitHub
 */
export async function signInWithGitHub() {
  try {
    const result = await signInWithPopup(auth, githubProvider);

    const user = result.user;
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    console.log("Utilisateur connecté via GitHub :", user);
    console.log("Token GitHub :", token);

    return { user, token };
  } catch (error) {
    console.error("Erreur lors de la connexion GitHub :", error);
    throw error;
  }
}