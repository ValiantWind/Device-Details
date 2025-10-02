class Card {
    constructor(cardData) {
        this.cardData = cardData;
        this.element = this.createCardElement();
        this.update();
    }

    createCardElement() {
        const card = document.createElement('div');
        card.className = 'card';

        const title = document.createElement('h2');
        title.textContent = this.cardData.title;
        card.appendChild(title);

        const value = document.createElement('p');
        value.id = this.cardData.id;
        value.textContent = 'Loading...';
        card.appendChild(value);

        if (this.cardData.footer) {
            const footer = document.createElement('footer');
            footer.className = 'card-footer';
            footer.textContent = this.cardData.footer;
            card.appendChild(footer);
        }

        return card;
    }

    async update() {
        const valueElement = this.element.querySelector(`#${this.cardData.id}`);
        try {
            const value = await this.cardData.getValue();
            valueElement.innerHTML = value;
        } catch (error) {
            console.error(`Error updating card "${this.cardData.title}":`, error);
            valueElement.textContent = 'Error';
        }
    }
}