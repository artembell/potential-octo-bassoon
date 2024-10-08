sudo apt update
sudo apt install snapd
sudo apt-get remove certbot
sudo snap install --classic certbot

sudo ln -s ~/projects/stripe-cli/stripe /usr/local/bin/stripe

stripe listen --forward-to localhost:3000/api/stripe/webhook

docker context create --docker "host"="ssh://root@147.45.245.21" remote