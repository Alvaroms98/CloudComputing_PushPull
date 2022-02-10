#!/bin/bash



if [ -z "$1" ]
then
    echo "Debes especificar el dominio como argumento test.sh <your-url.kumori.cloud>"
    exit
fi

    echo -e "\t ESCOGE UNA OPCIÓN: "
    echo "1. Saca todos los registros"
    echo "2. Inserta un registro"
    echo "3. Buscar un registro por ID"
    echo "4. Buscar un registro por Propietario"
    echo "5. Eliminar un registro por ID"
    echo "6. Elimina los registros de un Propietario"
    echo -e "7. Elimina todos los registros \n"

    read OPT

    echo "Escogiste la opción $OPT"
    case $OPT in
         1)
            echo -e "\nexecuting...." 
            curl --location --request GET "$1/api"
            echo  -e "\n"
        ;;

        2)
            echo -n "Elige nombre de propietario:  "
            read NAME

            echo -e "Inserta un objeto JSON válido \n"
            read OBJ

            echo -e "\nexecuting...." 
            curl --location --request POST "$1/api/propietario/$NAME" \
                --header 'Content-Type: application/json' \
                --data-raw "$OBJ"

            echo  -e "\n"
        ;;

        3)
            echo -n "Ingresa el ID del registro para buscar: "
            read ID

            echo -e "\nexecuting...."    
            curl --location --request GET "$1/api/id/$ID"

            echo  -e "\n"

        ;;

        4)
            echo -n "Ingresa el nombre del propietario para buscar registro: "
            read NAME

            echo -e "\nexecuting...."    
            curl --location --request GET "$1/api/propietario/$NAME"

            echo  -e "\n"

        ;;


        5)
            echo -n "Ingresa el ID del registro para eliminar: "
            read ID

            echo -e "\nexecuting...."    
            curl --location --request DELETE "$1/api/id/$ID"

            echo  -e "\n"

        ;;


        6)
            echo -n "Ingresa el nombre del propietario para eliminar sus registros: "
            read NAME

            echo -e "\nexecuting...."    
            curl --location --request DELETE "$1/api/propietario/$NAME"

            echo  -e "\n"

        ;;

        7)
            echo -n "Eliminaras todos los registros de la tabla deseas continuar (y/N)? "
            read ALL

            if [ "$ALL" = "y" ]
            then
                echo -e "\nexecuting...."    
                curl --location --request DELETE "$1/api"
                echo  -e "\n"
            else
                exit
            fi
        ;;

    *)
    ;;
    esac



  


