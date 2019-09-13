drop function if exists scheme_cmp;
delimiter //
create function scheme_cmp(search_key int, in_value int )
returns INTEGER
begin 
    declare num INTEGER default 0;
    if (search_key & 3)=(in_value & 3) and (search_key & 3)<>0  then
        set num=num+1;
    end if;

    if (search_key & (3<<2))=(in_value & (3<<2)) and (search_key & (3<<2))<>0  then
        set num=num+1;
    end if;

    if (search_key & (1<<4))=(in_value & (1<<4)) and (search_key & (1<<4))<>0 then
        set num=num+1;
    end if;

    if (search_key & (1<<5))=(in_value & (1<<5)) and (search_key & (1<<5))<>0 then
        set num=num+1;
    end if;

    if (search_key & (1<<6))=(in_value & (1<<6)) and (search_key & (1<<6))<>0 then
        set num=num+1;
    end if;

    if (search_key & (3<<7))=(in_value & (3<<7)) and (search_key & (3<<7))<>0 then
        set num=num+1;
    end if;

    if (search_key & (3<<9))=(in_value & (3<<9)) and (search_key & (3<<9))<>0 then
        set num=num+1;
    end if;

    if (search_key & (3<<11))=(in_value & (3<<11)) and (search_key & (3<<11))<>0 then
        set num=num+1;
    end if;

    if (search_key & (7<<13))=(in_value & (7<<13)) and (search_key & (7<<13))<>0 then
        set num=num+1;
    end if;

    if (search_key & (7<<16))=(in_value & (7<<16)) and (search_key & (7<<16))<>0 then
        set num=num+1;
    end if;

    return num;
end //
delimiter ;