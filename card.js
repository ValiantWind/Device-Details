class Card {
    constructor(cardData) {
        this.cardData = cardData;
        this.element = this.createCardElement();
        this.valueElement = this.element.querySelector(`#${this.cardData.id}`);
        this.update();
        this.initializeDynamicUpdates();
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

    setValue(html) {
        if (this.valueElement) {
            this.valueElement.innerHTML = html;
        }
    }

    async update() {
        try {
            const value = await this.cardData.getValue();
            this.setValue(value);
        } catch (error) {
            console.error(`Error updating card "${this.cardData.title}":`, error);
            this.setValue('Error');
        }
    }

    initializeDynamicUpdates() {
        if (typeof this.cardData.listener === 'function') {
            this.cardData.listener(this.setValue.bind(this));
        }
    }
}