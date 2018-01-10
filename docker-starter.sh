if [ ! -d $QSDT_CONFIG ]
then
    if [ "$CUSTOM_GIT_CONFIG" = "" ]
    then
        echo "CONFIG NOT SET, setting failover default config!"
        git clone https://github.com/arthmoeros/qsdt-core /usr/src/core-clone
        cp -rf /usr/src/core-clone/config $QSDT_CONFIG
    else
        echo "Custom config variable set, fetching from $CUSTOM_GIT_CONFIG"
        git clone $CUSTOM_GIT_CONFIG custom_config
        cp -rf ./custom_config $QSDT_CONFIG
    fi
fi
export QSDT_FS_CONFIG_PATH=$QSDT_CONFIG
npm start
