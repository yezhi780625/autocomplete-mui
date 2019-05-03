import React, { useCallback, useState, useRef, useEffect } from "react";
import { TextField, IconButton } from "@material-ui/core";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

function AutoComplete({
  items,
  loading,
  error,
  uniKey,
  inputValue,
  children,
  selectedItems: controlledSelectedItems,
  onChange: handleChange,
  onInputValueChange
}) {
  const input = useRef();
  const [{ isOpen, selectedItems }, setState] = useState({
    isOpen: false,
    selectedItems: []
  });
  const closeMenu = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);
  const toggleMenu = useCallback(event => {
    event.stopPropagation();
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);
  const toggleItem = useCallback(
    item => {
      const index = selectedItems.findIndex(
        selectedItem => selectedItem[uniKey] === item[uniKey]
      );
      if (index !== -1) {
        const newSelectedItems = [...selectedItems];
        newSelectedItems.splice(index, 1);
        setState(prev => ({ ...prev, selectedItems: newSelectedItems }));
      } else {
        setState(prev => ({
          ...prev,
          selectedItems: [...prev.selectedItems, item]
        }));
      }
    },
    [selectedItems, uniKey]
  );
  const handleInputValueChange = useCallback(
    function(event) {
      const value = event.target.value;
      if (typeof onInputValueChange === "function") {
        onInputValueChange(value);
      }
    },
    [onInputValueChange]
  );
  useEffect(() => {
    if (typeof handleChange === "function") {
      handleChange(selectedItems);
    }
  }, [selectedItems, handleChange]);
  AutoComplete;
  return (
    <ClickAwayListener onClickAway={closeMenu}>
      <div>
        <TextField
          inputRef={input}
          fullWidth
          variant="outlined"
          InputProps={{
            endAdornment: (
              <>
                <span
                  style={{
                    width: "180px",
                    fontSize: "12px",
                    textAlign: "right"
                  }}
                >{`select ${selectedItems.length} item${
                  selectedItems.length > 1 ? "s" : ""
                }`}</span>
                <IconButton
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 300ms"
                  }}
                  onClick={toggleMenu}
                >
                  <ArrowDropDown />
                </IconButton>
              </>
            )
          }}
          InputLabelProps={{
            shrink: true
          }}
          onClick={() => setState(prev => ({ ...prev, isOpen: true }))}
          onChange={handleInputValueChange}
          onKeyDown={event => {
            if (event.key === "Escape") {
              closeMenu();
            }
          }}
        />
        {typeof children === "function" &&
          children({
            isOpen,
            anchorEl: input.current,
            selectedItems,
            uniKey,
            toggleItem,
            toggleMenu
          })}
      </div>
    </ClickAwayListener>
  );
}

export default AutoComplete;
