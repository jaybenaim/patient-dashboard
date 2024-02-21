import { fbAuth, fb } from "../../config/firebaseConfig";

interface IUser {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

class Auth {
  user?: IUser;
  error?: IErrorMessage;

  constructor(user?: IUser, error?: IErrorMessage) {
    this.user = user;
    this.error = error;
  }

  handleError(err: any) {
    var errorCode = err.code;
    var errorMessage = err.message;
    if (errorCode) {
      this.error = {
        success: false,
        code: errorCode,
        message: errorMessage,
      };
      return this.error;
    } else {
      this.error = {
        success: false,
        message: errorMessage,
      };
      return this.error;
    }
  }

  async loginWithEmail(email: string, password: string) {
    try {
      const authResponse = await fbAuth.signInWithEmailAndPassword(
        email,
        password
      );
      return {
        success: true,
        data: authResponse,
      };
    } catch (err: any) {
      console.log("ERROR Auth.loginWithEmail", err);
      this.handleError(err);
    }
  }

  async loginWithProvider() {
    try {
      var provider = new fb.auth.GoogleAuthProvider();
      provider.addScope("email");
      // Force open 'Choose your account'
      provider.setCustomParameters({
        prompt: "consent",
      });

      const authResponse = (await fbAuth.signInWithPopup(provider)) as any;
      const userInfo = authResponse.additionalUserInfo as any;

      const extraFields = {
        // eslint-disable-next-line camelcase
        firstName: userInfo?.profile.given_name,
        // eslint-disable-next-line camelcase
        lastName: userInfo?.profile.family_name,
        fullName: userInfo?.profile.name,
      };

      if (userInfo?.isNewUser) {
        await this.create(
          authResponse.user.uid,
          userInfo?.profile?.email,
          extraFields
        );
      }

      const user = {
        id: authResponse.user.uid,
        email: userInfo?.profile?.email,
        isNewUser: authResponse.additionalUserInfo.isNewUser,
        extraFields,
      };

      this.user = user;

      if (user.id) {
        return {
          success: true,
          data: user,
        };
      }

      return {
        success: false,
        data: authResponse,
      };
    } catch (err: any) {
      console.log("ERROR Auth.loginWithProvider", err);
      this.handleError(err);
    }
  }

  async createUserWithEmail(email: string, password: string) {
    //   ): Promise<ApiResponse<IUser>> {

    try {
      var provider = new fb.auth.GoogleAuthProvider();
      provider.addScope("email");
      // Force open 'Choose your account'
      provider.setCustomParameters({
        prompt: "consent",
      });

      const authResponse = await fbAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      return {
        success: true,
        data: {
          id: authResponse.user?.uid,
          email: authResponse.user?.email,
        },
      };
    } catch (err: any) {
      console.log("ERROR Auth.loginWithProvider", err);
      return this.handleError(err);
    }
  }

  async signup(
    provider: "google" | "email",
    email?: string,
    password?: string
  ) {
    if (provider === "email") {
      if (email && password) {
        const authResponse = await this.createUserWithEmail(email, password);

        if (authResponse.success) {
          if (!authResponse.data.id) {
            return {
              success: false,
              message: "Check email and password",
            };
          }
          const { id } = authResponse.data as IUser;

          const user = await this.create(id!, email);
          return {
            success: true,
            data: user,
          };
        } else {
          return this.error;
        }
      } else {
        this.error = {
          success: false,
          message: "Check email and password",
        };
      }
    } else {
      const signinResponse = await this.loginWithProvider();

      if (signinResponse?.success) {
        if (signinResponse.data.isNewUser) {
          this.create(
            signinResponse.data.id,
            signinResponse.data.email,
            signinResponse.data.extraFields
          );
        }
        return {
          success: true,
          data: signinResponse.data,
        };
      }
    }
  }

  async signOut() {
    try {
      await fbAuth.signOut();
      this.user = {} as IUser;
    } catch (err) {
      console.log("ERROR Auth.signOut", err);
      return err;
    }
  }

  async get(id: string) {
    try {
      let user;
      const userResponse = await fetch(`/api/users/${id}`, {
        method: "GET",
      });

      if (userResponse) {
        user = await userResponse.json();
        this.user = user;
      }

      return user;
    } catch (err) {
      console.log("[ERROR] Auth.getUser", err);
      this.error = {
        success: false,
        message: "Failed to get user",
      };
      return this.error;
    }
  }

  async create(id: string, email: String, extraFields?: IUser) {
    try {
      let user;
      const userResponse = await fetch("/api/users/", {
        method: "POST",
        body: JSON.stringify({
          id,
          email,
          extraFields,
        }),
      });

      if (userResponse) {
        user = await userResponse.json();
        this.user = user;
      }

      return user;
    } catch (err) {
      console.log("ERROR Auth.createUser", err);
      this.error = {
        success: false,
        message: "Failed to create user account",
      };
      return this.error;
    }
  }
}

export default Auth;
