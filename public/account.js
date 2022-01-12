const logoutBtn = document.querySelector('.userLogoutBtn')

logoutBtn.addEventListener('click', async ()=>{
    const logout = await fetch('/users/logout',{
        headers:{
            credentials: 'include'
        },
        method: 'GET'
    }).then(res=>{res.json()}).catch(err=>console.log(err))
    return window.location.replace('/portal.html')
})