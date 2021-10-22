Rebilly.initialize({
    // Use your own publishable key:
    publishableKey: 'pk_sandbox_1234',
    icon: {
        color: '#0d2b3e',
    },
    style: {
        base: {
            fontSize: '18px',
            boxSahdow: 'none'
        }
    }
});

const form = document.querySelector('form');
const message = document.querySelector('.message');
const button = document.querySelector('button');

Rebilly.on('ready', function () {
    Rebilly.card.mount('#mounting-point');
});

form.onsubmit = async function (e) {
    e.preventDefault();
    e.stopPropagation();
    
    try {
        button.disabled = true;
        // create a token from the fields within a form
        const paymentToken = await Rebilly.createToken(form);

        const transactionResponse = await fetch('http://localhost:3000/create-transaction', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
            body: JSON.stringify(paymentToken)
        });

        const transactionData = await transactionResponse.json();

        // Handles approval url redirects
        if (transactionData._links.map(item => item.rel).includes('approvalUrl')) {
            const {href: approvalUrl} = transactionData._links.find(item => item.rel === 'approvalUrl');
            window.location = approvalUrl;
        } else {
            window.location = 'http://localhost:3000/success.html'
        }
    } catch (error) {
        message.classList.add('is-error');
        message.innerText = 'Something went wrong, please try again.';
        console.log(error);
    } finally {
        button.disabled = false;
    }
};
