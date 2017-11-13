if [ ! -d /etc/qsdt ]
then
    git clone https://github.com/arthmoeros/qsdt-core /usr/src/core-clone
    cp -rf /usr/src/core-clone/config /etc/qsdt
fi
npm start