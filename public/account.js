const accountInitial = document.querySelector('.accountImage').querySelector('p')
const userName = document.querySelector('.accountName')
const middleThird = document.querySelector('.middleThird')
const devBtn = `<div class="button userFnBtn devEndpointBtn" href="/dev.html">Super secret endpoints</div>`

window.addEventListener('load',async ()=>{
    const rawUserDetails = await fetch('/users/details').then(res=>res.json()).catch(err=>console.log(err))
    const data = rawUserDetails.data
    accountInitial.textContent = data.name[0].toUpperCase()
    userName.textContent = data.name

    //display button if role is dev. Insecure at this stage but the server restricts the dev routes
    if(data.role === 'dev'){
        middleThird.insertAdjacentHTML('beforeend', devBtn)
    } 
})

/////////////////
//Logout button//
/////////////////
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