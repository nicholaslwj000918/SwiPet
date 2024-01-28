class Profile {
    constructor(){
        this.profile = {
            profile_url : "",
            job_title: "",
            full_name: "",
        role: "petadopter",
        uid: "",
        about_me: "",
        age: 18,
        country: "",
        email: "",
        user: ""
        }
    }

    createProfile(profile){
        this.profile = profile;
    }

    static createProfileObject(role, uid, about_me, email, age, country, user) {
        this.profile = {
            role: role,
            uid: uid,
            about_me: about_me,
            age: age,
            country: country,
            email: email,
            user: user
        }
    }




}