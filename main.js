//HTTP request get,get/id,post,put/id, delete/id
async function LoadData() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json();

        let body = document.getElementById("table-body");
        body.innerHTML = "";

        for (const post of posts) {
            let style = post.isDeleted ? "text-decoration: line-through; color: gray;" : "";

            body.innerHTML += `
                <tr style="${style}">
                    <td>${post.id}</td>
                    <td>${post.title}</td>
                    <td>${post.views}</td>
                    <td>
                        <input type="button" value="delete" onclick="Delete('${post.id}')"/>
                    </td>
                </tr>`;
        }
    } catch (error) {
        console.log(error);
    }
}//
async function Save() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;

    if (id === "") {
        let resAll = await fetch("http://localhost:3000/posts");
        let posts = await resAll.json();

        let maxId = 0;
        posts.forEach(p => {
            let numId = parseInt(p.id);
            if (numId > maxId) maxId = numId;
        });

        let newId = String(maxId + 1);

        let res = await fetch("http://localhost:3000/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: newId,
                title: title,
                views: views,
                isDeleted: false
            })
        });

        if (res.ok) console.log("Thêm dữ liệu thành công");
    }
    else {
        let res = await fetch("http://localhost:3000/posts/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title,
                views: views
            })
        });

        if (res.ok) console.log("Cập nhật dữ liệu thành công");
    }

    LoadData();
}
async function Delete(id) {
    let res = await fetch("http://localhost:3000/posts/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            isDeleted: true
        })
    });

    if (res.ok) {
        console.log("Xoá mềm thành công");
    }
    LoadData();
}
//CRUD với comments
async function LoadComments() {
    let res = await fetch("http://localhost:3000/comments");
    let comments = await res.json();

    let body = document.getElementById("comment-body");
    body.innerHTML = "";

    comments.forEach(c => {
        let style = c.isDeleted ? "text-decoration: line-through; color: gray;" : "";
        body.innerHTML += `
            <tr style="${style}">
                <td>${c.id}</td>
                <td>${c.postId}</td>
                <td>${c.content}</td>
                <td>
                    <button onclick="DeleteComment('${c.id}')">delete</button>
                </td>
            </tr>`;
    });
}
//
async function SaveComment() {
    let content = document.getElementById("comment_txt").value;
    let postId = document.getElementById("post_id_txt").value;

    let resAll = await fetch("http://localhost:3000/comments");
    let comments = await resAll.json();

    let maxId = 0;
    comments.forEach(c => {
        let numId = parseInt(c.id);
        if (numId > maxId) maxId = numId;
    });

    let newId = String(maxId + 1);

    let res = await fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: newId,
            postId: postId,
            content: content,
            isDeleted: false
        })
    });

    if (res.ok) console.log("Thêm comment thành công");
    LoadComments();
}
async function DeleteComment(id) {
    let res = await fetch("http://localhost:3000/comments/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            isDeleted: true
        })
    });

    if (res.ok) console.log("Xoá mềm comment thành công");
    LoadComments();
}

