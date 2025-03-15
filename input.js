document.getElementById("login").addEventListener('submit',function(event){
    event.preventDefault();

    const email=document.getElementById('login-mail');
    const pass=document.getElementById('login-password');
    const data={email,password:pass};

    fetch('http://localhost:5173/login',{
        method:'POST',
        headers: {
              'Content-Type': 'application/json'
        },
        body : JSON.stringify(data)
    })
    .then(response=>response.json())
    .then(result=>{
        if(result.status === true){
            const name=result.name
            window.location.href = `/index.html?name=${name}`;
        }
        else{
            alert ('User name or password is wrong');
            window.location.reload();
        }
})
    .catch(error=> {
        console.log('Error : ',error);
    });
});

document.getElementById("signup").addEventListener('submit',function(event){
    event.preventDefault();

    const username =document.getElementById('signup-name');
    const email =document.getElementById('signup-email');
    const pass =document.getElementById('signup-password');
    const cpass =document.getElementById('signup-confirm-password');
    const data ={username ,mail:email,password:pass};

    if(pass!=cpass){
        alert ('Password and Confirm password doesnt matches');
        window.location.reload();
    }
    else{
        fetch('http://localhost:5173/signup',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
           },
          body : JSON.stringify(data)
      })
      .then(response=>response.json())
      .then(result=> {
        if(result.status==='un'){
            alert('User name already taken !');
            window.location.reload();
        }
        else if(result.status==='ug'){
            alert('This mail has an existing account ! /n Try to login ...');
            window.location.reload();
        }
        else if(result ==='s'){
            const name =result.name;
            window.location.href = `/index.html?name=${name}`;
        }
    })
        }
    });

    