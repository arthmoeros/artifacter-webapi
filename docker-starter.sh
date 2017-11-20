if [ ! -d $QSDT_CONFIG ]
then
    echo "CONFIG NOT SET, setting failover default config!"
    git clone https://github.com/arthmoeros/qsdt-core /usr/src/core-clone
    cp -rf /usr/src/core-clone/config $QSDT_CONFIG
fi
export QSDT_FS_CONFIG_PATH=$QSDT_CONFIG
npm start