if [ ! -d /etc/qsdt ]
then
    echo "CONFIG NOT SET, setting failover config!"
    git clone https://github.com/arthmoeros/qsdt-core /usr/src/core-clone
    cp -rf /usr/src/core-clone/config /etc/qsdt
fi
export QSDT_FS_CONFIG_PATH=/etc/qsdt
npm start