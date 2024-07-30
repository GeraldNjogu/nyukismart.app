body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
    font-family: Arial, sans-serif;
    background: url('smart.logo.jfif') no-repeat center center fixed;
    background-size: cover;
}

.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    text-shadow: 2px 2px 4px #000000;
    padding: 20px; /* Add padding for small screens */
    box-sizing: border-box;
}

header {
    position: absolute;
    top: 0;
    right: 0;
    margin: 20px;
}

.buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
}

button {
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    transition: transform 0.3s ease, background-color 0.3s ease;
}

button:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 1);
}

.animated-button {
    animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.content h1 {
    font-size: 48px;
    margin-bottom: 20px;
    animation: slideInDown 2s ease-in-out;
}

.content p {
    font-size: 24px;
    animation: slideInUp 2s ease-in-out;
}

@keyframes slideInDown {
    from { transform: translateY(-100px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInUp {
    from { transform: translateY(100px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

/* Media Queries for Responsiveness */
@media (max-width: 768px) {
    .content h1 {
        font-size: 36px;
    }
    
    .content p {
        font-size: 18px;
    }
    
    header {
        margin: 10px;
    }

    button {
        padding: 8px 16px;
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .content h1 {
        font-size: 28px;
    }
    
    .content p {
        font-size: 16px;
    }
    
    button {
        padding: 6px 12px;
        font-size: 12px;
    }

    .buttons {
        gap: 5px;
    }
}

    
