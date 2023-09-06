const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");


const handleRemoveComment = async (event) => {
  const child = event.target.parentElement;
  const commentid = child.dataset.id;
  const response = await fetch(`/api/comment/${commentid}/remove`, {
      method : "DELETE",
  });
  if(response.status === 200){
      child.remove();
  };
};

const addComment = async (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i")
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const rmvBtn = document.createElement("span");
  rmvBtn.innerText = " ❌"
  rmvBtn.addEventListener("click", handleRemoveComment);
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(rmvBtn);
  videoComments.prepend(newComment);
};


const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  console.log(text);
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response  = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    // server.js, videocontroller.js, apirouter.js, commentsection.js
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
    
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

