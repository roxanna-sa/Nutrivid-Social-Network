// aqui exportaras las funciones que necesites

import { addDoc, collection, getDocs, doc, deleteDoc , serverTimestamp, query, orderBy, arrayUnion, updateDoc } from "firebase/firestore"
import { auth, db } from "../firebase"

export const createPost = async (text) => {
  const newPost = await addDoc(collection(db, 'posts'), {
    postContent: text,
    user: auth.currentUser.email,
    userName: auth.currentUser.displayName,
    timestamp: serverTimestamp(),
  });
  console.log('createPost....', newPost.path);
};

export const addLike = async (postId) => {
  const postRef = doc(db, 'posts', postId); // Reference to /posts
  const userRef = doc(db, 'users', auth.currentUser.uid); // Reference to /users
  
  // actualiza el like en el post
  updateDoc(postRef, {
    likedBy: arrayUnion(userRef), // <- de quién es el like?
  }).then((res) => {
    console.log(res);
  });
}


export const getPosts = () => {
  const postRef = collection(db, 'posts');
  const q = query(postRef, orderBy("timestamp", "desc"));
  return getDocs(q).then((res) => {
    let postsArray = [];
    res.forEach((doc) => {
      // creamos un objeto data que tendrá el contenido y le agregamos por nuestra parte la ID que NO viene dentro de doc.data()
      let data = doc.data();
      data["id"] = doc.id;
      postsArray.push(data);
      return doc.data();
    })

    return postsArray;
  })
};


// export const deletePost = (id) => deleteDoc(doc(db, 'posts', id));

export const deletePost = async (postId) => {
  await deleteDoc(doc(db, 'posts', postId));
};