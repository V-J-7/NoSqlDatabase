package com.fnp.nosqldatabase.exception;

public class NoEntryInDatabaseException extends RuntimeException {
    public NoEntryInDatabaseException(String message) {
        super(message);
    }
}
