# Makefile

ENV_FILE := .env

.PHONY: create-env

create-env:
	@echo "CAPTCHA_API_KEY = \"$(KEY)\"" > $(ENV_FILE)
	@echo ".env created"