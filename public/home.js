const steps = document.querySelectorAll('.step')
steps.forEach(step=>{
    const stepIcon = step.querySelector('.material-icons')
    console.log(stepIcon)
    step.addEventListener('mouseenter',()=>{
        stepIcon.style.transform = 'scale(1.1)'
    })
    step.addEventListener('mouseout',()=>{
        stepIcon.style.transform = null
    })
})